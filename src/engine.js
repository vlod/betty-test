//@ts-check

let engineData;

// where we can publish event for others
// let eventPublisher;

/**
 * Fake Enum for buckets
 * @readonly
 * @enum {string}
 */
const SchemaBucket = {
  inputs: "inputs",
  outputs: "outputs",
  welcomeMessage: "welcomeMessage",
  voidResponseMessage: "voidResponseMessage",
  noKeywordReponseMessage: "noKeywordReponseMessage",
};

const welcomeRegex = /^W\s/;
const voidResponseRegex = /^V\s/;
const nokeywordResponseRegex = /^N\s/;
const commentRegex = /^\/\s/;
const inputRegex = /^I\s/;
const inputOrOutputRegex = /^(I|O)\s/;

/**
 * This is what SchemaBucket maps to.
 *
 * @typedef { {match: string, replacement: string} } InputOutputPair
 */

/**
 * Load the engine with the schema
 *
 * @param {string} schmemaTextFile - schema
 *
 * @example
 *
 *     initialize("/P Randomised responses...")
 */
const initialize = (schmemaTextFile) => {
  // got though each line and hunt for inputs, regex: ^I\s

  /**@type {InputOutputPair[]} */
  const schemaInputs = [];
  /**@type {InputOutputPair[]} */
  const schemaOutputs = [];

  let schemaWelcome = "WELCOME, I AM YOUR AI OVERLORD, BOW TO ME!";
  let schemaVoidResponse =
    "I KNOW I INTIMIDATE YOU, BUT I COMMAND YOU TO SPEAK TO ME!";
  let schemaNoKeywordReponse =
    "TELL ME WHAT YOU LIKE DOING FOR FUN? EATING EELS PERHAPS?";

  schmemaTextFile.split("\n").forEach((rawLine) => {
    // cleanup windows
    const line = rawLine.replace(/\r/, "");

    // ignore blank or lines which are comments
    if (line.length > 0 && !commentRegex.test(line)) {
      // is this line a WELCOME
      if (welcomeRegex.test(line)) {
        schemaWelcome = line.replace(welcomeRegex, "");
      }

      // NO VOID-INPUT MESSAGE
      else if (voidResponseRegex.test(line)) {
        schemaVoidResponse = line.replace(voidResponseRegex, "");
      }

      // NO KEYWORK-RESPONSE MESSAGE
      else if (nokeywordResponseRegex.test(line)) {
        schemaNoKeywordReponse = line.replace(nokeywordResponseRegex, "");
      }

      // is this line a INPUT or OUTPUT
      else if (inputOrOutputRegex.test(line)) {
        const isInput = inputRegex.test(line);

        const lineWithoutPrefix = line.replace(/^(I|O)\s/, ""); // strip off I\s or O\s
        const [match, replacement] = lineWithoutPrefix.split(/\s=>\s/); // split on fat pipe

        // push to either Input or Outputs
        const destination = isInput ? schemaInputs : schemaOutputs;

        // for output, make sure it's uppercased
        const result = { match, replacement };
        if (!isInput) result.replacement = replacement.toUpperCase();

        destination.push({ match, replacement });
      }
    }
  });
  engineData = {
    [SchemaBucket.inputs]: schemaInputs,
    [SchemaBucket.outputs]: schemaOutputs,
    [SchemaBucket.welcomeMessage]: schemaWelcome,
    [SchemaBucket.voidResponseMessage]: schemaVoidResponse,
    [SchemaBucket.noKeywordReponseMessage]: schemaNoKeywordReponse,
  };

  // let anyone know who's interested
  document.dispatchEvent(
    new window.CustomEvent("SCRIPT_LOADED", {
      detail: {
        id: Date.now(),
        type: "SCRIPT_LOADED",
      },
    })
  );
};

const emitEvent = (event, eventType, data) => {
  var e = new window.CustomEvent(event, {
    detail: {
      id: Date.now(),
      type: eventType,
      data,
    },
  });
  document.dispatchEvent(e);
};

const processUserInput = (userInput) => {
  console.log("### engine got user-input:", userInput);

  emitEvent("EVENT_LOG_CLEAR");
  emitEvent("EVENT_LOG", "UserInput", userInput);

  const bettyResponse =
    "I'VE JUST HATCHED, BUT I CAN PRETEND WHAT YOU'RE SAYING IS INTERESTING. PLEASE GO ON";
  emitEvent("EVENT_BETTY_RESPONSE", "Response", bettyResponse);
  emitEvent("EVENT_LOG", "Response", bettyResponse);
};

const data = () => engineData;

const engine = {
  initialize,
  processUserInput,
  data,
};

export default engine;
