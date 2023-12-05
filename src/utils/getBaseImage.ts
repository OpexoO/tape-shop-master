const decodeBaseImage = (file: File): Promise<string> => new Promise((res, rej) => {
  const reader = new FileReader();
  reader.onload = () => {
    res(reader.result as string);
  };
  reader.onerror = () => {
    rej('File reading error');
  };
  reader.readAsDataURL(file);
});
export default decodeBaseImage;
