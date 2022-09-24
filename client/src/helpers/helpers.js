const getBoolValue = (arg) => arg === true ? true : arg == 'true' ? true : arg === false ? false : arg == 'false' ? false : null

export {
    getBoolValue
}