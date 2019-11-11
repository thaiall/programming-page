// program id : 9
// 1. แสดงการใช้คำสั่ง do .. while 
// 2. ตรวจเงื่อนไขแบบ ทำก่อนเช็ค
// 3. ใช้ try catch จับปัญหา array
public class j0206 {
  public static void main(String args[]) {
    System.out.println("print 1 to 10 :: ");
    int i = 1;
    try {
      do {
        System.out.println(i);
        i++;
      } while (i <= 10);    	
    }
    catch (ArrayIndexOutOfBoundsException e) {
      System.out.println("over index of array");
	} 
  }
}
