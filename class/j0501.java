// program id : 19
// 1. ประกาศอาร์เรย์ และแสดงข้อมูลในอาร์เรย์ทั้งหมด 
public class j0501 {
  public static void main(String args[]) {
    int x[] = {4,18,12};    
    System.out.println("Amount of x = " + x.length);
    Integer y[] = new Integer[4];    
    System.out.println("Amount of y = " + y.length);
    for (int i = 0; i < x.length; i++) {
      System.out.println("element "+i+" = "+x[i]);
    }
  }
}
