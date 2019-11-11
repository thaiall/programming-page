// program id : 36
// 1. นำอาร์เรย์มาเปรียบเทียบ และจัดเรียงแบบ bubble sort 
// 2. ข้อมูลในอาร์เรย์เป็นแบบตัวเลข
// 3. การสลับค่า เช่น t = a; a = b; b = t; 
public class j1001 {
  public static void main (String args[]) {
    int tmp,x[] = {5,6,1,2,9,12,9,3};
    for(int i=1;i<x.length;i++) {
      for(int j=x.length-1;j>=i;j--) {
        if(x[j-1] > x[j]) {
           tmp = x[j];
           x[j] = x[j-1];
           x[j-1] = tmp;
        }
      }
    }
    for(int i=0;i<x.length;i++) {
       System.out.println(x[i]);
    }
  }
}
