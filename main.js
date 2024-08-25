// @ts-check
/// <reference path="paths.js" />

/**
 * @typedef Item
 * @property {HTMLImageElement} node
 * @property {String} data
 */

/**
 * @typedef Tier
 * @property {String} name
 * @property {String} color
 * @property {Item[]} items
 * @property {HTMLDivElement} node
 */

/**
 * @typedef State
 * @property {Tier[]} tierlist
 * @property {Tier} tray
 * @property {Item?} dragged
 */

// TODO: get rid of global variables
const TIER_HEIGHT = 87

/** @type {State} */
let state
renderUI()