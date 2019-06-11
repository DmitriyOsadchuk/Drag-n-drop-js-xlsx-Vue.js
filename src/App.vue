<template>
  <div id="app">
    <div @drop="_drop" @dragenter="_suppress" @dragover="_suppress" class="drop">
      <div class="row">
        <div class="col-xs-12">
          <form class="form-inline">
            <div class="form-group">
              <input type="file" class="form-control" id="file" :accept="SheetJSFT" ref="file" @change="_change"/>
              <div  class="default-label" id="default-label">Перетащите сюда файл <br> или нажмите чтобы выбрать</div>
            </div>
          </form>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th v-for="c in cols" :key="c.key">{{c.name}}</th>
                </tr>
              </thead>
              <tbody>
              <tr v-for="(r, key) in data" :key="key">
                <td v-for="c in cols" :key="c.key"> {{ r[c.key] }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import XLSX from 'xlsx'

  const make_cols = refstr => Array(XLSX.utils.decode_range(refstr).e.c + 1).fill(0).map((x,i) => ({name:XLSX.utils.encode_col(i), key:i}));
  const _SheetJSFT = [
    "xlsx", "xlsb", "xlsm", "xls", "xml", "docx", "csv", "txt", "jpg", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "html", "htm"
  ].map(function(x) { return "." + x; }).join(",");
  export default {
    data() {
      return {
        data: ["SheetJS".split(""),
          "1234567".split("")
        ],
        cols: [
          {name:"A", key:0},
          {name:"B", key:1},
          {name:"C", key:2},
          {name:"D", key:3},
          {name:"E", key:4},
          {name:"F", key:5},
          {name:"G", key:6},
        ],
        SheetJSFT: _SheetJSFT
      }; },

    methods: {


      _suppress(evt) { evt.stopPropagation(); evt.preventDefault(); },
      _drop(evt) {
        evt.stopPropagation(); evt.preventDefault();
        const files = evt.dataTransfer.files;
        if(files && files[0]) this._file(files[0]);
      },

      _change(evt) {
        const files = evt.target.files;
        const file = this.$refs.file.files[0];
        var defaultValueLebel = document.getElementById("default-label");

        if(file.size > 100000){
          defaultValueLebel.innerHTML= "Допустимый розмер файла 10Мб, выбирете <br> другой файл";
        }

        else if (file.size < 10000000){
        if(files && files[0]) this._file(files[0]);
          defaultValueLebel.innerHTML= "Файл - "+ " "+file.name;
          console.log(file.size +"B");
        }

         var fileName = file.name.split('.');
        if (fileName[1]!= "xlsx"&& fileName[1]!= "xls"){
          defaultValueLebel.innerHTML= " Не допустисмый тип файла" + " '."+fileName[1]+"'," +" " + "выбирете  другой <br> файл";
        }
        console.log( file.type=== "xlsx"||file.type ===  "xls");
      },

      _file(file) {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        reader.onload = (e) => {
          /* Parse data */
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, {type:'binary'});
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws, {header:1});
           console.log(data);
          /* Update state */
          this.data = data;
          this.cols = make_cols(ws['!ref']);
        };
        reader.readAsBinaryString(file);
      }
    }

  };
</script>

<style lang="scss">
  .form-group{
    min-height: 200px;
    padding: 10px 10px;
    position: relative;
    cursor: pointer;
    outline: 2px dashed grey;
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
  }

.form-control{
  opacity: 0;
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

  .form-group:hover{
    background: lightblue;
  }

.default-label {
  font-size: 1.8rem;
  text-align: center;
  align-items: center;
  padding: 70px 0;
  display: flex;
  justify-content: center;
}
</style>
