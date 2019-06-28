const styles = {
  column: {
    flex: '1 0 0 ',
    padding: '5px',
  },
  formBg: {
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
    padding: '0 20px',
    width: '100%',
  },
  heading: {
    background: '#dedddd',
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
  optionsColumn: {
    flex: '0 0 150px',
    padding: '5px',
    textAlign: 'right',
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
