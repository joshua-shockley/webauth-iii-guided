exports.up = function(knex) {
    return knex.schema.table('users', tbl => {
        tbl.string('another', 128);
    });
};

exports.down = function(knex) {
    return knex.schema.table('users', tbl => {
        tbl.dropColumn('another');
    });
};