/**
 * file App.js
 * author: David Hanley
 * last-modified: 2022-02-15
 */
import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

/**
 * Name: Calculator
 * Purpose: This is the main module that will be exported.
 * Parameters: N/A
 * Preconditions: N/A
 * Returns: The basic layout of the app is as follows:
 * <View>
 *  <View style={screenView}> Display screen goes here </View>
 *  <View style={buttonsView}> Buttons go here </View>
 * </View>
 * side-effects: Calculator magic.
 */
const Calculator = () => {
  // array for buttonValues which can be used with array.map() function to assign components and styles. order matters.
  const buttonValues = [ 'C', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', 'delete', '=', ];
  // getter/setter for display
  const [display, setDisplay] = useState('');
  // currNumber stores the current number which can be used to check if it already has a decimal point or not.
  const [currNumber, setCurrNumber] = useState(''); 
  
  /**
   * Name: evaluateExpr   
   * Purpose: this function evaluates a math string expression and returns the result as a number.
   * Mozilla recommends using this method instead of eval() as it is more secure and efficient.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!
   * 
   * Parameters: 
   *  <1> e: String that contains a mathematical expression.
   * Preconditions: 
   *  <1> The string that is passed must contain an expression that can be evaluated.
   *  <2> Function is called when the user presses the equals key.
   * 
   * Returns: The result of the mathematical string expression as a number (int/float).
   * Side-effects:
   *  <1> The value that is returned is a number which must be cast to a string so it can be displayed on the screen.
   */
  function evaluateExpr(e) {
    return new Function('return ' + e)();
  }

   /**
   * Name: userInput
   * Purpose: This function handles the user input and the calculator input logic.
   * For example, if the user has already entered a decimal in the current number, don't permit another decimal.
   * 
   * Parameters: 
   *  <1> input: This is the button object that the user has pushed.
   * Preconditions: 
   *  <1> display and currNumber hooks must be initialized.
   *  <2> function evaluateExpr(string) must also be initialized.
   * Returns: N/A
   * Side-effects:
   *  <1> 
   */  
  const userInput = (input) => {
    // input is an object with button property mapped to char value
    // store button string in var value. 
    var value = input.button;
    // switch statement checks string value
    switch (true) {
      // if user has entered an operator
      case value === '*' || value === '/' || value === '+' || value === '-':
        // checks if display is empty or if operator has already been entered. if so don't add another operator.
        // there will only be a space after an operator, so last character is checked for space.
        if (display === '' || display.slice(-1) == ' ') {          
          setDisplay(display);
          // if user has only entered a decimal, set to 0 + operator
        } else {
          // if no operator add spacing and operator value. set currNumber to empty.
          setDisplay(display + ' ' + value + ' ');
          setCurrNumber('');
        }
        break;      
      // C clears the display and the current number.  
      case value === 'C':
        setDisplay('');
        setCurrNumber('');
        break;
      case value === 'delete':
        // if the final character is a space then operator was last thing added
        // delete the operator and spacing surrounding it.
        if (display.slice(-1) == ' ') {
          setDisplay(display.substring(0, display.length - 3));
        } else {
          setDisplay(display.substring(0, display.length - 1));
          setCurrNumber(display.substring(0, display.length - 1));
        }
        break;
      // if user entry is a number or decimal
      case !isNaN(value) || value === '.':
        // if currNum is 0 and value is 0, don't add more 0s
        if (currNumber === '0' && value === '0') {
          setCurrNumber(value);
          // if current number is 0 and input value is another number, replace the 0
        } else if (currNumber === '0' && !isNaN(value)) {
          setCurrNumber(value);
          setDisplay(value);
          // if current number already contains decimal, don't add another
        } else if (currNumber.includes('.') && value === '.') {
          setDisplay(display);
          // if current number is empty and decimal entered, setDisplay to 0.
        } else if (currNumber === "" && value === '.') {
          setDisplay(display + "0" + value);
        } else {
          setDisplay(display + value);
          setCurrNumber(currNumber + value);
        }
        break;
      case value === '=':
        // call the evaluateExpr function and cast it to a string.
        // otherwise it can't be used in setDisplay.
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
        {/**
         * use map function on array of button values.
         * map allows different values to be assigned different attributes.
         * the delete button has been assigned a special icon imported from react-native-vector-icons.
         * the C button has a different width added to it so it fills the remaining space in the top row.
         */  }
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