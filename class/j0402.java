// program id : 16
// 1. การเขียน method เพื่อรับค่าไปประมวลผล
// 2. ผลของ sum = 140 เพราะอะไร
public class j0402 {
  public static void main(String args[]) {
    int s = 0;
    s = sub(2,8,s);
    s = sub(7,3,s);
    s = sub(4,6,s);
    System.out.println("Sum = "+s);
  }
  public static int sub(int x, int y, int z) { 
    int a = y + x + z;
    return (a + y + x + z);    
  }
}
