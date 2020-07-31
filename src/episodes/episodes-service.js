const EpisodesService = {
    getAllEpisodes(knex) {
      return knex.select('*').from('episodes')
    },
    insertEpisode(knex, newEpisode){
      return knex
          .insert(newEpisode)
          .into('episodes')
          .returning('*')
          .then(rows => {
            return rows[0]
      })
    },
    getById(knex, episode_id){
        return knex
          .from('episodes')
          .select('*')
          .where({ episode_id })
          .first()
      },
    deleteEpisode(knex, episode_id){
      return knex('episodes')
          .where({ episode_id })
          .delete()
    }
  }
  
module.exports = EpisodesService;
