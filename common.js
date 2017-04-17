;
function isMessageValid(message) {
  return !!message.type;
}

function l(log) {
  console.log(log);
}

function logInfo(log) {
  console.log(log.blue);
}

function logWarn(log) {
  console.log(log.yellow);
}

function logError(log) {
  console.log(log.red);
}

function logOK(log) {
  console.log(log.green);
}

function logExotic(log) {
  console.log(log.cyan);
}

function setTerminalTitle(title)
{
  process.stdout.write(
    String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7)
  );
}

module.exports = {
  l,
  logInfo,
  logWarn,
  logError,
  logOK,
  logExotic,
  isMessageValid,
  setTerminalTitle,
}
;