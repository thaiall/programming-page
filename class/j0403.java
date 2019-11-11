// program id : 17
// 1. การใช้ method หาค่า 2 เท่า 
// 2. ประกาศ method ไม่มี public ก็ได้ อยู่ในคลาส
public class j0403 {
  public static void main(String args[]) {
    int j = 3;
    System.out.println(doubleofnumber(j));
  }
  static int doubleofnumber(int i) {
    i = i * 2;
    return (i);
  }
}
