import java.io.*;
public class pollweb{
  public static void main (String args[]) throws IOException {
    int i=0;
    int questionhave = 14;
    int q[] = new int[questionhave];
    String b;
    String[] fields;
    String patternStr = ",";
    FileReader fin = new FileReader("pollweb.txt");
    BufferedReader bin = new BufferedReader (fin);
    while ((b =  bin.readLine()) != null) {
      fields = b.split(patternStr);
      for (int j=1;j<=questionhave-1;j++) 
        q[j]+= Integer.parseInt(fields[j]);
      i = i + 1;
    }
    System.out.println("Total questions: " + i);
    for (int j=1;j<=questionhave-1;j++)
      System.out.println(j+":"+q[j]+" | "+(q[j] * 100 / i)+"%");
    fin.close();
  }
}
