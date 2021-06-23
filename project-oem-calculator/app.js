//Storage Controller

const StorageController = (function () {

    return{
        storeProduct: function(product){
            let products;
            if(localStorage.getItem('products')===null){
                products = [];
            }else{
                products = JSON.parse(localStorage.getItem('products'));
            }
            products.push(product);
            localStorage.setItem('products', JSON.stringify(products));
        },
        getProducts: function(){
            let products;
            if(localStorage.getItem('products')===null){
                products = [];
            }else{
                products = JSON.parse(localStorage.getItem('products'));
            }
            return products;
        },
        updateProduct: function(product){
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach(function(prd,index){
                if(prd.id==product.id){
                    products.splice(index,1,product);
                }
            });
            localStorage.setItem('products', JSON.stringify(products));
        },
        deleteProduct: function(id){
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach(function(prd,index){
                if(id==prd.id){
                    products.splice(index,1);
                }
            });
            localStorage.setItem('products', JSON.stringify(products));
        }
    }
})();

//Product Controller
const ProductController = (function () {

    //private
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice: 0
    }

    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        addProduct: function (name, price) {
            let id;

            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;
            } else {
                id = 0;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);

            return newProduct;
        },
        getProductById: function (id) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd;
                }
            })

            return product;
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },
        getCurrentProduct: function () {
            return data.selectedProduct;
        },
        getTotalPrice: function () {
            let total = 0;

            data.products.forEach(function(item){
                total+= item.price;
            });

            data.totalPrice = total;

            return data.totalPrice;
        },
        updatedProduct: function (name, price) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            });

            return product;
        },
        deleteProduct: function(product){

            data.products.forEach(function(prd,index) {
                if(prd.id == product.id){
                    data.products.splice(index, 1);
                }
            })
        }
    }


})();

//UI Controller
const UIController = (function () {

    const Selectors = {
        productList: "#item-list",
        productListItems: '#item-list tr',
        addButton: '#addBtn',
        updateButton: '#updateBtn',
        deleteButton: '#deleteBtn',
        cancelButton: '#cancelBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalTL: '#total-tl',
        totalDolar: '#total-dolar'
    }


    return {
        createProductList: function (products) {
            let html = '';

            products.forEach(prd => {
                html += `
                    <tr>
                        <td >${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price} $</td>
                        <td class="text-right">
                            <i class="far fa-edit edit-product"></i>    
                        </td>
                    </tr>
                `;
            });

            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function () {
            return Selectors;
        },

        addProduct: function (prd) {

            document.querySelector(Selectors.productCard).style.display = 'block';

            var item = `
                <tr>
                    <td >${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price} $</td>
                    <td class="text-right">
                            <i class="far fa-edit edit-product"></i>
                    </td>
                </tr>
            `;

            document.querySelector(Selectors.productList).innerHTML += item;

        },

        clearInputs: function () {
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },

        clearWarnings: function(){
            var items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(item => {
                if(item.classList.contains('bg-warning')){
                    item.classList.remove('bg-warning');
                }
            })
        },

        hideCard: function () {
            document.querySelector(Selectors.productCard).style.display = 'none';
        },

        addProductToForm: function () {
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },

        showTotal: function (total) {
            let currency = 6;

            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTL).textContent = total*currency;
        },

        addingState: function () {
            UIController.clearWarnings();

            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.updateButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
        },

        editState: function (tr) {

            const parent = tr.parentNode;

            for (let i = 0; i < parent.children.length; i++) {
                parent.children[i].classList.remove('bg-warning');
            }

            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.updateButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
        },

        updateProduct: function (prd) {
            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + ' $';
                    updatedItem = item;
                }
            })

            return updatedItem;
        },

        deleteProduct: function (){
            let items = document.querySelectorAll(Selectors.productListItems);
            
            items.forEach(function(item){
                if(item.classList.contains('bg-warning')){
                    item.remove();
                }
            })
        }
    }

})();


//App Controller
const AppController = (function (ProductCtrl, UICtrl, StorageCtrl) {

    const UISelectors = UICtrl.getSelectors();

    //Load Event Listeners
    const loadEventListeners = function () {

        //add product
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);

        //edit product click
        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);

        //edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener('click', editProductSubmit);

        //cancel editing
        document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelEdit);

        //delete product
        document.querySelector(UISelectors.deleteButton).addEventListener('click', productDelete);


    }

    const productAddSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            //add item
            const newProduct = ProductCtrl.addProduct(productName, productPrice);

            //add item to list
            UIController.addProduct(newProduct);

            //add to LS
            StorageCtrl.storeProduct(newProduct);

            //clear inputs
            UIController.clearInputs();

            //calculate totals
            const total = ProductCtrl.getTotalPrice();
            UICtrl.showTotal(total);
        }

        //console.log(productName,productPrice);

        e.preventDefault();
    }

    const productEditClick = function (e) {

        if (e.target.classList.contains('edit-product')) {
            const id =
                e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            //get selected product
            const product = ProductCtrl.getProductById(id);


            //set current product
            ProductCtrl.setCurrentProduct(product);

            //add product to UI
            UICtrl.addProductToForm();

            UICtrl.editState(e.target.parentNode.parentNode);
        }

        e.preventDefault();
    }

    const editProductSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {

            //update product
            const updatedProduct = ProductCtrl.updatedProduct(productName, productPrice);

            //update ui
            let item = UICtrl.updateProduct(updatedProduct);

            //calculate totals
            const total = ProductCtrl.getTotalPrice();
            UICtrl.showTotal(total);

            //update LS
            StorageCtrl.updateProduct(updatedProduct);


            UICtrl.addingState();
        }

        e.preventDefault();
    }

    const productDelete = function(e){
        const selectedProduct = ProductCtrl.getCurrentProduct();

        //delete product from data
        ProductCtrl.deleteProduct(selectedProduct);

        //delete ui
        UICtrl.deleteProduct();

        //delete LS
        StorageCtrl.deleteProduct(selectedProduct.id);

        //calculate totals
        const total = ProductCtrl.getTotalPrice();
        UICtrl.showTotal(total);

        if(total==0){
            UICtrl.hideCard();
        }

        UICtrl.addingState();

        e.preventDefault();
    }

    const cancelEdit = function (e){
        UIController.addingState();
        
        e.preventDefault();
    }


    return {
        init: function () {
            console.log('starting app...');

            UICtrl.addingState();
            const products = ProductCtrl.getProducts();

            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);
            }
            //calculate totals
            const total = ProductCtrl.getTotalPrice();
            UICtrl.showTotal(total);
            
            loadEventListeners();
        }
    }


})(ProductController, UIController, StorageController);


AppController.init();
