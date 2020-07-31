const path = require('path');
const express = require('express');
const xss = require('xss');
const episodesService = require('./episodes-service');
const episodesRouter = express.Router();
const jsonParser = express.json();

// protects episode info against XSS attacks
const serializeEpisode = episode => ({
  episode_id: episode.id,
  episode_name: xss(episode.episode_name),
  date_created: episode.date_created,
  episode_questions: episode.episode_questions.map(q => [xss(q[0]), xss(q[1])]),
});

episodesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    
    episodesService.getAllEpisodes(knexInstance)
      .then(episodes => {
        res.json(episodes.map(serializeEpisode));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { episode_name, episode_questions, episode_id, date_created } = req.body;
    const newEpisodeInfo = { 
        episode_name, 
        episode_questions, 
        episode_id,
        date_created      
    };

    // check that all required fields are present
    for (const [key, value] of Object.entries({ episode_name, episode_questions, episode_id, date_created })) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    episodesService.insertEpisode(
      req.app.get('db'),
      newEpisodeInfo
    )
      .then(episode => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${episode.episode_id}`))
          .json(serializeEpisode(episode))
      })
      .catch(next);
  })

  episodesRouter
  .route('/:episode_id')
  .all((req, res, next) => {
    // checks if requested episode info exists
    episodesService.getById(
      req.app.get('db'),
      req.params.episode_id
    )
      .then(episode => {
        if (!episode) {
          return res.status(404).json({
            error: { message: `Episode doesn't exist` }
          });
        }
        res.episode = episode;
        next();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    episodesService.deleteEpisode(
      req.app.get('db'),
      req.params.episode_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next);
  })

module.exports = episodesRouter;