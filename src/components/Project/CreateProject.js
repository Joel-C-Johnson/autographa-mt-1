import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import VirtualizedSelect from 'react-virtualized-select';

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200
    }
  }
}));

export default function CreateProject() {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [useDataForLearning, setUseDataForLearning] = useState(false);
  const [all_languages, setAll_languages] = useState([]);
  const [selectedsources, setSelectedSources] = useState('');
  const [selectedlanguage, setSelectedlanguage] = useState('');
  const [responseStatus, setResponseStatus] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [opensuccess, setopensuccess] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handlePostClose = () => {
    setopensuccess(false);
  };

  const getLanguages = () => {
    axios
      .get('http://206.189.131.230/v2/languages')
      .then((response) => {
        setAll_languages(response.data);
      })
      .catch((error) => {
        console.error('Something went wrong!', error);
      });
  };

  useEffect(() => {
    getLanguages();
  }, []);

  const onClick = () => {
    if (JSON.stringify(selectedlanguage) === JSON.stringify(selectedsources)) {
      setOpen(true);
    } else {
      const data = {
        projectName: name,
        sourceLanguageCode: !selectedsources ? '' : selectedsources.code,
        targetLanguageCode: !selectedlanguage ? '' : selectedlanguage.code,
        useDataForLearning: useDataForLearning,
        stopwords: {
          prepositions: [
            'कोई',
            'यह',
            'इस',
            'इसे',
            'उस',
            'कई',
            'इसी',
            'अभी',
            'जैसे'
          ],
          postpositions: [
            'के',
            'का',
            'में',
            'की',
            'है',
            'और',
            'से',
            'हैं',
            'को',
            'पर'
          ]
        },
        punctuations: [
          ',',
          '"',
          '!',
          '.',
          ':',
          ';',
          '\n',
          '\\',
          '“',
          '”',
          '“',
          '*',
          '।',
          '?',
          ';',
          "'",
          '’',
          '(',
          ')',
          '‘',
          '—'
        ],
        active: true
      };

      axios
        .post('http://128.199.18.6/v2/autographa/projects', data)
        .then((response) => {
          setResponseStatus(response.status);
        })
        .catch((error) => {
          console.error('Something went wrong!', error);
        });
      setopensuccess(true);
    }
  };

  const clearState = () => {
    setName('');
    setSelectedlanguage('');
    setUseDataForLearning(false);
    setSelectedSources('');
  };

  const languageData = [];
  if (all_languages != null) {
    Object.values(all_languages).map((lang) => {
      languageData.push({
        label: lang.language,
        value: lang.languageId,
        code: lang.code
      });
    });
  }

  const canBeSubmitted = () => {
    return (
      name.length > 0 &&
      selectedsources instanceof Object &&
      selectedlanguage instanceof Object
    );
    // }
  };

  const isEnabled = canBeSubmitted();

  return (
    <Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error'>
          Can't choose same Source Language and Target Language
        </Alert>
      </Snackbar>
      <Snackbar
        open={opensuccess}
        autoHideDuration={6000}
        onClose={handlePostClose}
      >
        <Alert onClose={handlePostClose} severity='success'>
          {!responseStatus.length ? 'Something wrong' : responseStatus}
        </Alert>
      </Snackbar>
      <Grid container style={{ padding: '35px' }}>
        <Grid item sm={2} style={{ paddingLeft: '30px', paddingTop: '12px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Name</span>
        </Grid>

        <Grid item sm={10}>
          <form className={classes.root} noValidate autoComplete='off'>
            <TextField
              id='outlined-size-small'
              variant='outlined'
              size='small'
              value={name}
              onChange={(e) => setName(e.target.value)}
              inputProps={{ style: { padding: '8px' } }}
            />
          </form>
        </Grid>

        <Grid item sm={2} style={{ paddingLeft: '30px', paddingTop: '12px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
            Source Language
          </span>
        </Grid>

        <Grid
          item
          sm={10}
          style={{
            paddingLeft: '8px',
            paddingRight: '872px',
            paddingTop: '8px'
          }}
        >
          <VirtualizedSelect
            options={languageData}
            onChange={(e) => setSelectedSources(e)}
            value={selectedsources}
          />
        </Grid>

        <Grid item sm={2} style={{ paddingLeft: '30px', paddingTop: '12px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
            Target Language
          </span>
        </Grid>

        <Grid
          item
          sm={10}
          style={{
            paddingLeft: '8px',
            paddingRight: '872px',
            paddingTop: '8px'
          }}
        >
          <VirtualizedSelect
            options={languageData}
            onChange={(e) => setSelectedlanguage(e)}
            value={selectedlanguage}
          />
        </Grid>

        <Grid item sm={4} style={{ marginTop: '15px' }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Advanced Options
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container item sm={12}>
                <Grid item sm={12}>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {' '}
                    Stop Words
                  </span>
                </Grid>
                <Grid
                  item
                  sm={12}
                  style={{
                    paddingLeft: '12px',
                    fontSize: '14px',
                    marginTop: '6px'
                  }}
                >
                  <span> Pre Position - pre1, pre2, pre3...</span>
                </Grid>
                <Grid
                  item
                  sm={12}
                  style={{ paddingLeft: '12px', fontSize: '14px' }}
                >
                  <span> Post Position - post1, post2, post3...</span>
                </Grid>

                <Grid item sm={12} style={{ marginTop: '6px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {' '}
                    Punctuations
                  </span>
                </Grid>
                <Grid
                  item
                  sm={12}
                  style={{
                    paddingLeft: '12px',
                    fontSize: '14px',
                    marginTop: '6px'
                  }}
                >
                  <span> [. , ; ' [ {} - @ ^ *</span>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid container direction='row' style={{ marginTop: '15px' }}>
          <Grid item sm={2} style={{ paddingLeft: '30px', paddingTop: '12px' }}>
            <span style={{ fontSize: '18px' }}>Use Data For Learning</span>
          </Grid>

          <Grid item sm={8}>
            <Checkbox
              inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
              onChange={(e) => setUseDataForLearning(e.target.checked)}
            />
          </Grid>
        </Grid>

        <Grid container direction='row' style={{ marginTop: '20px' }}>
          <Grid item sm={1} style={{ paddingLeft: '25px' }}>
            <Button
              size='small'
              disabled={!isEnabled}
              variant='contained'
              color='primary'
              onClick={onClick}
            >
              Save
            </Button>
          </Grid>
          <Grid item sm={1}>
            <Button
              size='small'
              variant='contained'
              color='secondary'
              onClick={clearState}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
