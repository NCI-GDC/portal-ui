import { theme } from '@ncigdc/theme/index';

const styles = {
  actionsColumn: {
    flex: '0 0 90px',
    padding: '5px',
    textAlign: 'right',
  },
  column: {
    flex: '1 0 0 ',
    padding: '5px',
  },
  defaultInfo: {
    border: `2px solid ${theme.greyScale6}`,
    borderRadius: '5px',
    fontSize: '1.8rem',
    marginBottom: '10px',
    padding: '1rem 5rem 1rem 1rem',
    paragraph: {
      margin: 0,
      paddingRight: '2rem',
    },
  },
  disabledButton: {
    backgroundColor: theme.greyScale4,
    borderColor: theme.greyScale4,
    color: '#fff',
    ':hover': {
      backgroundColor: theme.greyScale4,
      borderColor: theme.greyScale4,
      color: '#fff',
    },
  },
  formBg: {
    backgroundColor: theme.greyScale6,
    borderRadius: '5px',
    padding: '0 20px',
    width: '100%',
  },
  heading: {
    backgroundColor: theme.greyScale5,
    display: 'flex',
    fontWeight: 'bold',
    lineHeight: '20px',
    marginBottom: '5px',
    padding: '2px 5px',
  },
  input: {
    inputError: {
      color: 'red',
    },
    inputHorizontal: {
      margin: '0',
      padding: '5px',
      width: '100px',
    },
    inputInTable: {
      padding: '5px',
      width: '100%',
    },
    inputInvalid: {
      border: '2px solid red',
    },
    inputText: {
      lineHeight: '34px',
      padding: '0 10px',
    },
    inputWrapper: {
      display: 'flex',
      marginBottom: '15px',
    },
    inputWrapper100px: { maxWidth: '100px' },
  },
  intervalWrapper: {
    display: 'flex',
    marginBottom: '15px',
  },
  optionsButton: {
    display: 'inline-block',
    height: 34,
    textAlign: 'center',
    width: 40,
  },
  resetButton: {
    marginTop: 20,
  },
  row: {
    rowError: {
      color: 'red',
      padding: '0 5px 10px',
    },
    rowFieldsWrapper: {
      display: 'flex',
      flex: '1 0 0',
    },
  },
  scrollingTable: {
    maxHeight: '250px',
    overflowY: 'auto',
  },
  visualizingButton: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    color: '#333',
  },
  wrapper: {
    marginBottom: '20px',
    width: '100%',
  },
};

export default styles;
