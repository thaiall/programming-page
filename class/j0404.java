// program id : 18
// 1. สร้าง class ใหม่และเรียก method ใน class ใหม่ 
// 2. แสดงการใช้ super และ this ใน constructor
// 3. .java แฟ้มหนึ่ง อาจมีได้หลาย class
// 4. extends ใช้เพื่อ inherit จาก class พ่อ
public class sub01 {
  void subx() {
    System.out.println("subx in sub01");
  }
}
public class sub02 {
  void subx() {
    System.out.println("subx in sub02");
  }
}
public class j0404 extends sub02 {
  j0404() { 
    super.subx(); // subx in sub02
    this.subx(); // subx in main
  }
  public static void main(String args[]) {
    sub01 x = new sub01();
    System.out.println("main"); // main
    x.subx();      // subx in sub01
    j0404 y = new j0404();    
  }
  void subx() {
    System.out.println("subx in main");
  }
}
