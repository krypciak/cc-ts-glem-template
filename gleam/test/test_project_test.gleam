import gleeunit
import gleeunit/should
import test_project

pub fn main() {
  gleeunit.main()
}

pub fn i_return_1_test() {
  test_project.i_return_1()
  |> should.equal(1)
}
