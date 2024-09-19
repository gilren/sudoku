export function isSudokuCell(
  value: number,
): value is 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 {
  return value >= 0 && value <= 9;
}

export function createButton(
  el: HTMLButtonElement,
  text: string,
  classes: Array<string>,
  clickCallback?: void,
) {
  el.textContent = text;
  el.classList.add(...classes);

  el.addEventListener('click', () => {
    clickCallback;
  });
  return el;
}
