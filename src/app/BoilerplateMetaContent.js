const BoilerplateMetaContent = ({ children }) => {
  return (
    <>
      <meta httpEquiv="content-language" content="en-us" />
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      {children}
    </>
  );
};

export default BoilerplateMetaContent;
