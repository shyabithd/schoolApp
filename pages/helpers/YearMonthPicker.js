import React, {useState} from 'react';
import MonthYearPicker from 'react-month-year-picker';
import { connect } from 'react-redux';

function mapStateToProps(state) {
    return {
      year: state.year,
      month: state.month
    };
}

const YearMonthPicker = (props) => {

  const [isVisible, setIsvisible] = useState(false);
    
    const setYear = (year) => {
        props.dispatch({ type: 'YEAR', year: year });
    }

    const setMonth = (month) => {
        props.dispatch({ type: 'MONTH', month: month });
    }

    const toggle = () => {
      setIsvisible(!isVisible);
    }

    const date = new Date(props.year, props.month);
    const monthStr = date.toLocaleString('default', { month: 'long' });
    return (
      <div className="mt-4">
        <label>
          <a onClick={toggle}>
            Click here to select Year and Month
          </a>
        </label>
        <div >
        <label>
            Selected Year: {props.year} Month: { monthStr }
        </label>
        </div>
        {
          isVisible === false ? <></> :
            <MonthYearPicker
              selectedMonth={props.month}
              selectedYear={props.year}
              minYear={2000}
              maxYear={2100}
              onChangeYear={year => setYear(year)}
              onChangeMonth={month => setMonth(month)}
            />
        }
      </div>
    );
}

export default connect(mapStateToProps)(YearMonthPicker);
