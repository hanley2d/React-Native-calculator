import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const Calculator = () => {
  // array for buttonValues which can be used with array.map() function to assign components and styles. order matters.
  const buttonValues = [ 'C', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', 'delete', '=', ];
  const [display, setDisplay] = useState('');
  // currNumber stores the current number which can be used to check if it already has a decimal point or not.
  const [currNumber, setCurrNumber] = useState(''); 

  // this function evaluates a math string expression and returns the result as an int/float.
  // mozilla recommends using this instead of eval() as it is more secure and efficient.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!
  function evaluateExpr(e) {
    return new Function('return ' + e)();
  }

  // Calculator input logic
  const userInput = (input) => {
    // input is an object with button property mapped to char value
    var value = input.button;

    switch (true) {
      // if user has entered an operator
      case value === '*' || value === '/' || value === '+' || value === '-':
        // checks if display is empty or if operator has already been entered. if so don't add another operator.
        if (display === '' || display.slice(-1) == ' ') {          
          setDisplay(display);
        } else {
          setDisplay(display + ' ' + value + ' ');
          setCurrNumber('');
        }
        break;        
      case value === 'C':
        setDisplay('');
        setCurrNumber('');
        break;
      case value === 'delete':
        if (display.slice(-1) == ' ') {
          setDisplay(display.substring(0, display.length - 3));
        } else {
          setDisplay(display.substring(0, display.length - 1));
          setCurrNumber(display.substring(0, display.length - 1));
        }
        break;
      // if user entry is a number or decimal
      case !isNaN(value) || value === '.':
        if (currNumber === '0' && value === '0') {
          setCurrNumber(value);
        } else if (currNumber === '0' && !isNaN(value)) {
          setCurrNumber(value);
          setDisplay(value);
        } else if (currNumber.includes('.') && value === '.') {
          setDisplay(display);
        } else {
          setDisplay(display + value);
          setCurrNumber(currNumber + value);
        }
        break;
      case value === '=':
        var result = String(evaluateExpr(display));
        setDisplay(result);
        setCurrNumber(result);
        break;
    }
    return;
  };
  return (
    <View style={styles.container}>
      {/* Screen View */}
      <View style={styles.screenView}>
        <Text style={styles.text}>{display}</Text>
      </View>

      {/* Buttons View */}
      <View style={styles.buttonsView}>
        {buttonValues.map((button) =>
          button === 'delete' ? (
            <Pressable 
              key={button}
              style={styles.button}
              onPress={() => userInput({ button })}>
              <FontAwesome5 name="step-backward" size={25} color="white" />
            </Pressable>
          ) : button === 'C' ? (
            <Pressable
              key={button}
              style={styles.cButton}
              onPress={() => userInput({ button })}>
              <Text style={styles.text}>{button}</Text>
            </Pressable>
          ) : (
            <Pressable
              key={button}
              style={styles.button}
              onPress={() => userInput({ button })}>
              <Text style={styles.text}>{button}</Text>
            </Pressable>
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: '#09011B',
    justifyContent: 'center',
    flexWrap: 'wrap',
    borderColor: 'black',
    borderWidth: 2,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 35,
    textAlign: 'center',
  },
  screenView: {
    flex: 3,
    backgroundColor: '#1B2642',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 4,
    margin: 5,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#1B2642',
    borderColor: '#3DA5',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20%',
    minHeight: '20%',
    borderRadius: 100,
    margin: 2,
    flex: 1,
  },
  cButton: {
    backgroundColor: '#1B2642',
    borderColor: '#3DA5',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '69%',
    minHeight: '20%',
    borderRadius: 50,
    margin: 2,
    flex: 1,
  },
});

export default Calculator;