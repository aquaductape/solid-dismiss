const MiniForm = () => {
  return (
    <form
      action=""
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <input class="input-test" type="text" placeholder="text input..." />
      <input class="input-test" type="text" placeholder="Another one..." />
    </form>
  );
};

export default MiniForm;
