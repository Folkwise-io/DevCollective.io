import Knex from "knex";
import * as knexfile from "./knexfile";

const knex = Knex(knexfile);

export default knex;
