// program id : 12
// 1. แสดงการรับค่าจากแป้นพิมพ์แบบ character 
// 2. รับต่อกันไปเรื่อย ๆ จนรับตัวอักษร 0 เข้าไปจึงหยุด
// 3. ไม่ import java.io.*
public class j0303 {
  public static void main(String args[]) throws java.io.IOException {
    System.out.println("Get until receive 0 [hidden is 13, 10]");
    char buf;
    do {
      buf = (char)System.in.read();
      System.out.println("Output is "+buf);
    } while (buf != '0');
  }
}
