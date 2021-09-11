const FocusGutter = () => {
  return (
    <button
      class="focus-gutter"
      aria-label="focus gutter, for focus demonstration"
      onClick={(e) => e.currentTarget.focus()}
    ></button>
  );
};

export default FocusGutter;
