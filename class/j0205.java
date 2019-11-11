// program id : 8
// 1. แสดงการใช้คำสั่ง while แบบเช็คก่อนทำ
// 2. กำหนดค่าเริ่มต้น 1 หรือ 0
// 3. ใช้ double ทำให้ผลหารถูกต้อง จึงไม่ catch
public class j0205 {
  public static void main(String args[]) {
    System.out.println("print 1 to 10 :: ");
    int i;
    i = -5;
    while (i <= 5) {
      try {
        i++;
        System.out.println((double)5/i); //Infinity
		System.out.println(5/i); //catch ok
      }
      catch (ArithmeticException e) {
        System.out.println("may divide by zero");
      }
    }	
    int k = 0;
	i = 0;
    while (i < 5) {
      System.out.print(++k);
      k = k + (i++);
      System.out.print(k--);
    } // 11122447711
  } 
}