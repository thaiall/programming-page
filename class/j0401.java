// program id : 15
// 1. มี 3 method ใน class และเรียกใช้ 
// 2. ผลคือ xyx ให้นศ.ฝึกสร้าง method
public class j0401 {
  public static void main(String args[]) {
    sub1(); sub2(); sub1();
  }
  static void sub1() { 
    System.out.print("x");
  }
  static void sub2() { System.out.print("y"); }
}
