export default function validation(element) {
  const fullCoordRegExp = /^\[?[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)\]?$/;

  if (fullCoordRegExp.test(element.value)) {
    element.setCustomValidity('');
  } else {
    element.setCustomValidity('Не корректный ввод');

    /* istanbul ignore next */
    /* c8 ignore next */
    alert('Не корректный ввод');
  }

  return element.validity.customError;
}
