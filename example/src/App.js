import React from 'react';
import { ApplicationBar, BibleDropDown, CreateProject } from 'autographa-mt';

import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';

const App = () => {
  return (
    <div>
      <ApplicationBar />
      <BibleDropDown />
      <CreateProject />
    </div>
  );
};

export default App;
