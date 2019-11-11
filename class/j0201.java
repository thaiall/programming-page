// program id : 4
// 1. แสดงการใช้คำสั่ง if 
// 2. ความแตกต่างของ print และ println
// 3. การใช้ { } หรือไม่ใช้ ต่างกันอย่างไร
public class j0201 {
  public static void main(String args[]) {
    int x;
    x = 6;
    if (x > 5) System.out.println("more than 5:" + x);
    if (x > 5 && x < 10) System.out.println("five to ten");
    if (x > 5 || x < 10) System.out.println("all numbers");
    if (x > 10) { 
       System.out.print("more than 10:");
       System.out.println(x);
    }
  }
}
