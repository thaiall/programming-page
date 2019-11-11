// program id : 1 
// 1. ต.ย.การแปล javac j0100.java
// 2. ต.ย.การประมวลผล java j0100 abc def
// 3. สามารถรับ parameter จากภายนอก
// 4. ผลที่ได้จะเห็นเลข 2 เพราะรับเข้าไป 2 ค่า
// 5. https://docs.oracle.com/javase/specs/
// 6. ทดสอบที่ https://www.compilejava.net/
public class j0100 {
  public static void main(String args[]) {
    System.out.println(args.length); // 2
    System.out.println(args[0]);   // abc
  }
}