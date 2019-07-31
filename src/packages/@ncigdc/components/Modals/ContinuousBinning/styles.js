import { theme } from '@ncigdc/theme/index';

const styles = {
  actionsColumn: {
    flex: '0 0 150px',
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
    inputDisabled: {
      background: '#efefef',
    },
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
    margin: '2px 0 0 5px',
    textAlign: 'center',
    width: '40px',
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
