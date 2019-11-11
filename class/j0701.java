// program id : 29
// 1. อ่านข้อมูลจากแฟ้ม data.txt แบบ csv มาแสดงผล
// 101,tom,2000,single
// 102,somchai,5000,married
// 2. คำสั่ง split แยก field ด้วย patternStr
import java.io.*;
public class j0701 {
  public static void main (String args[]) throws IOException {
    int i = 1;
    int tot = 0;
    String b;
    String[] fields;
    String patternStr = ","; // this var may be removed
    FileReader fin = new FileReader("data.txt");
    BufferedReader bin = new BufferedReader (fin);
    while ((b =  bin.readLine()) != null) {
      fields = b.split(patternStr);
      System.out.println(i + " : " + fields[0]);
      System.out.println("Name : " + fields[1]);
      System.out.println("Salary : " + fields[2]);
      System.out.println("Status : " + fields[3]);
      tot = tot + Integer.parseInt(fields[2]);
      i = i + 1;
    }
    System.out.println("Total : " + tot);
    fin.close();
  }
}
