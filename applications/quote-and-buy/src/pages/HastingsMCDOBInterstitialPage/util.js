

export const handleDayBlur = (value, setDataFunction, setTouchedfunction = null) => {
    if (value) { setDataFunction(String(value).padStart(2, '0')); }
    if (setTouchedfunction) { setTouchedfunction(true); }
};

export const handleMonthBlur = (value, setDataFunction, setTouchedfunction = null) => {
    if (value) { setDataFunction(String(value).padStart(2, '0')); }
    if (setTouchedfunction) { setTouchedfunction(true); }
};

export const handleYearBlur = (setTouchedfunction) => {
    setTouchedfunction(true);
};

export const handleDayChange = (value, setDataFunction, nexInputRef) => {
    setDataFunction(value);
    if (value.length === 2) { nexInputRef.current.focus(); }
};

export const handleMonthChange = (value, setDataFunction, nexInputRef) => {
    setDataFunction(value);
    if (value.length === 2) { nexInputRef.current.focus(); }
};

export const handleYearChange = (value, setFunction, setTouchedfunction = null) => {
    setFunction(value);
    if (setTouchedfunction && value.length === 4) { setTouchedfunction(true); }
};

export const handleFocus = (event) => event.target.select();
