import gleam/io

pub fn test_function() {
  io.println("test print from gleam")
  // io.debug doesnt print
  io.debug("test debug from gleam")
  "test return from gleam"
}

pub fn i_return_1() {
  1
}
