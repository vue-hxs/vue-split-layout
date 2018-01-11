var a, b, c
a = () => {
  console.log('A')
  return 1
}
b = () => {
  console.log('B')
  return 2
}
c = () => {
  console.log('C')
  return 3
}

var D = a() && b() || c()
console.log(D)
