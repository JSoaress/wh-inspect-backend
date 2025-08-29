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
    pgm.createTable("projects", {
        id: { type: "uuid", primaryKey: true },
        name: { type: "varchar(100)", notNull: true },
        description: { type: "varchar" },
        slug: { type: "varchar", notNull: true },
        created_at: { type: "timestamp", notNull: true },
        is_active: { type: "bool", notNull: true, default: true },
        members: { type: "varchar", notNull: true },
        owner: { type: "uuid", notNull: true, references: '"users"' },
    });
    pgm.addConstraint("projects", "projects_owner_slug_unique", {
        unique: ["slug", "owner"],
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("projects");
};
