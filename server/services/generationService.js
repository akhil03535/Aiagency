/**
 * Generation service. Orchestrates: resolve business profile → build prompt
 * → call aiClient → parse output → persist Generation + History row.
 *
 * This is the one place prompt files, the AI client, and Prisma all meet —
 * controllers stay thin and never touch any of those directly.
 */
const prisma = require('../config/prisma');
const aiClient = require('./ai/aiClient');
const { getPromptBuilder, getSupportedContentTypes } = require('../prompts');
const { parseStructuredOutput, extractHashtags } = require('../utils/outputParser');
const { AppError } = require('../middleware/errorHandler');

/**
 * Resolves which business profile to use for personalization:
 * - explicit businessProfileId if provided and owned by the user
 * - otherwise the user's default profile
 * - otherwise null (generation proceeds without business context)
 */
async function resolveBusinessProfile(userId, businessProfileId) {
  if (businessProfileId) {
    const profile = await prisma.businessProfile.findFirst({
      where: { id: businessProfileId, userId },
    });
    if (!profile) {
      throw new AppError('Business profile not found.', 404);
    }
    return profile;
  }

  return prisma.businessProfile.findFirst({
    where: { userId, isDefault: true },
  });
}

async function generateContent(userId, input) {
  const { contentType, businessProfileId, ...rest } = input;

  const promptBuilder = getPromptBuilder(contentType);
  if (!promptBuilder) {
    throw new AppError(
      `Unsupported content type "${contentType}". Supported: ${getSupportedContentTypes().join(', ')}`,
      400
    );
  }

  const businessProfile = await resolveBusinessProfile(userId, businessProfileId);

  const messages = promptBuilder.build({ ...rest, businessProfile });

  let aiResult;
  try {
    aiResult = await aiClient.complete(messages, { temperature: 0.8, maxTokens: 1500 });
  } catch (err) {
    // Persist the failed attempt so it's visible in history/admin analytics,
    // then re-throw so the controller returns an error to the user.
    await prisma.generation
      .create({
        data: {
          userId,
          businessProfileId: businessProfile?.id,
          contentType,
          topic: rest.topic,
          goal: rest.goal,
          targetAudience: rest.targetAudience,
          tone: rest.tone,
          length: rest.length,
          language: rest.language || 'English',
          offer: rest.offer,
          keywords: rest.keywords || [],
          callToAction: rest.callToAction,
          inputPayload: input,
          outputContent: '',
          status: 'FAILED',
          errorMessage: err.message,
        },
      })
      .catch(() => {}); // best-effort log; don't mask the original error

    throw err;
  }

  const parsed = parseStructuredOutput(aiResult.content);
  const hashtags = extractHashtags(parsed);

  const generation = await prisma.generation.create({
    data: {
      userId,
      businessProfileId: businessProfile?.id,
      contentType,
      topic: rest.topic,
      goal: rest.goal,
      targetAudience: rest.targetAudience,
      tone: rest.tone,
      length: rest.length,
      language: rest.language || 'English',
      offer: rest.offer,
      keywords: rest.keywords || [],
      callToAction: rest.callToAction,
      inputPayload: input,
      outputContent: aiResult.content,
      hashtags,
      aiProvider: aiResult.provider,
      aiModel: aiResult.model,
      tokensUsed: aiResult.tokensUsed,
      generationTimeMs: aiResult.generationTimeMs,
      status: 'SUCCESS',
    },
  });

  // Every successful generation is automatically logged to History.
  await prisma.history.create({
    data: { userId, generationId: generation.id },
  });

  return { generation, parsed };
}

async function regenerate(userId, generationId) {
  const existing = await prisma.generation.findFirst({
    where: { id: generationId, userId },
  });
  if (!existing) {
    throw new AppError('Generation not found.', 404);
  }

  return generateContent(userId, {
    ...existing.inputPayload,
    contentType: existing.contentType,
  });
}

module.exports = { generateContent, regenerate };
