const asyncHandler = require('express-async-handler');
const { success, created } = require('../utils/apiResponse');
const generationService = require('../services/generationService');
const { getSupportedContentTypes } = require('../prompts');

const generate = asyncHandler(async (req, res) => {
  const { generation, parsed } = await generationService.generateContent(
    req.user.id,
    req.body
  );

  return created(res, {
    message: 'Content generated successfully',
    data: {
      generation: {
        id: generation.id,
        contentType: generation.contentType,
        topic: generation.topic,
        hashtags: generation.hashtags,
        aiProvider: generation.aiProvider,
        aiModel: generation.aiModel,
        generationTimeMs: generation.generationTimeMs,
        createdAt: generation.createdAt,
      },
      output: parsed,
    },
  });
});

const regenerate = asyncHandler(async (req, res) => {
  const { generation, parsed } = await generationService.regenerate(
    req.user.id,
    req.params.id
  );

  return success(res, {
    message: 'Content regenerated successfully',
    data: {
      generation: {
        id: generation.id,
        contentType: generation.contentType,
        topic: generation.topic,
        hashtags: generation.hashtags,
        aiProvider: generation.aiProvider,
        aiModel: generation.aiModel,
        generationTimeMs: generation.generationTimeMs,
        createdAt: generation.createdAt,
      },
      output: parsed,
    },
  });
});

const listContentTypes = asyncHandler(async (req, res) => {
  return success(res, {
    message: 'Supported content types',
    data: { contentTypes: getSupportedContentTypes() },
  });
});

module.exports = { generate, regenerate, listContentTypes };
