const FocusGutter = () => {
  return (
    <button
      class="focus-gutter"
      aria-label="focus gutter, for focus demonstration"
      onClick={(e) => e.currentTarget.focus()}
      tabindex="-1"
    ></button>
  );
};

export default FocusGutter;
