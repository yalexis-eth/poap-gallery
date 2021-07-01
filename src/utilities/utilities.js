

export const shrinkAddress = (address, length) => {
  if (address.length < length) return address;
  return address.substr(0, length/2) + '…' + address.substr(address.length - (length/2-1))
}
