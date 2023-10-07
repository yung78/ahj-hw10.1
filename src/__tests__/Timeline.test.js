import validation from '../Timeline/js/validation';

document.body.innerHTML = `
  <input
    class="geolocation_input"
    name="geolocation_input" 
    type="text" 
    required />
`;

const coordinates = [
  ['51.50851, -0.12572', false], // есть пробел
  ['51.50851,-0.12572', false], // нет пробела
  ['[51.50851,-0.12572]', false], // есть квадратные скобки
  ['51.50851 -0.12572', true], // не валидные (нет запятой м/у координатами)
  ['[51,l50851,-0,12572]', true], // не валидные (десятичный разделитель - запятые)
  ['', true], // не валидные (пустой запрос)
];

test.each(coordinates)('validation function', (coords, waitFor) => {
  const input = document.querySelector('.geolocation_input');
  input.value = coords;

  const result = validation(input);

  expect(result).toBe(waitFor);
});
