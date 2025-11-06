/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.sql(`
    INSERT INTO parameters (id,key,value,is_system) VALUES
	 ('019a56d7-5c5e-78bd-b535-c80a7198e869'::uuid,'subscription.plan.freemium','019a5698-2ced-7332-99ec-6b9ed99661de'::uuid,false);
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`TRUNCATE parameters;`);
};
