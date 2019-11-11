// program id : 31
// 1. อ่านข้อมูลเก็บลงอาร์เรย์ แล้วนำไปเขียนลงแฟ้ม data.htm 
// 2. เพิ่มค่าให้ field เงินเดือนจากเดิมอีก 100 บาท
import java.io.*;
public class j0703 {
  public static void main (String args[]) throws IOException {
    int i = 0,d;
    String b;
    String[] fields;
    String[] recs = {"","",""}; // only 3 records
    String patternStr = ",";
    //
    FileReader fin = new FileReader("data.txt");
    BufferedReader bin = new BufferedReader (fin);
    //
    while ((b =  bin.readLine()) != null) {
      recs[i] = b;
      i = i + 1;
    }
    fin.close();
    //
    FileOutputStream fout = new FileOutputStream("data.htm");
    BufferedOutputStream bout = new BufferedOutputStream(fout);
    PrintStream pout = new PrintStream(bout);
    for(int j=0;j<i;j++) {
      fields = recs[j].split(patternStr);
      pout.print(fields[0]+","+fields[1]+",");
      // pout.print(Double.valueOf(fields[2]).doubleValue());
      d = Integer.valueOf(fields[2]).intValue() + 100;
      pout.print(d);
      pout.println(","+fields[3]);
    }
    pout.close();
  }
}
