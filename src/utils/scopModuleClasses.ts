export const scopeModuleClasses =
  (inputModuleClasses: CSSModuleClasses) =>
  (...selectors: (string | boolean)[]) => {
    // ...args: (string | [CSSModuleClasses, string])[]
    //     if (args.length > 1) {
    //       return args
    //         .map((item) => {
    //           if (typeof item === "string") {
    //             return inputModuleClasses[item];
    //           }
    //
    //           const moduleClasses = item[0];
    //           const name = item[1];
    //
    //           return moduleClasses[name];
    //         })
    //         .join(" ");
    //     }

    return selectors.reduce((acc, item) => {
      if (typeof item === "boolean") return acc + "";
      return acc + " " + inputModuleClasses[item];
    }, "") as string;
  };
