import React, { useEffect, useRef } from 'react';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export const AccountsUIWrapper = () => {
  const container = useRef(null);

  useEffect(() => {
    // Render the Blaze accounts form in this component
    const view = Blaze.render(Template.loginButtons, container.current);
    return () => {
      // Clean up Blaze view on component unmount
      Blaze.remove(view);
    };
  }, []);

  return <span ref={container} />;
};
