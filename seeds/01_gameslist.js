
exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('games').del(),
    
    knex('games').insert({id:1,title:'Amarantz',cover:'none'})
  
  );
};
