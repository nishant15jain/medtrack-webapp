import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProducts, searchProductsByName, deleteProduct } from '../../api/productApi';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../doctors/DoctorList.css';

const ProductList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery],
    queryFn: () => searchQuery ? searchProductsByName(searchQuery) : getAllProducts(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    },
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRowClick = (product) => {
    navigate(`/products/${product.id}`);
  };

  const handleAddProduct = () => {
    navigate('/products/new');
  };

  const handleEdit = (e, product) => {
    e.stopPropagation();
    navigate(`/products/${product.id}/edit`);
  };

  const handleDeleteClick = (e, product) => {
    e.stopPropagation();
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
    }
  };

  const columns = [
    { key: 'name', label: 'Product Name', width: '25%' },
    { key: 'category', label: 'Category', width: '15%' },
    { key: 'manufacturer', label: 'Manufacturer', width: '20%' },
    { 
      key: 'description', 
      label: 'Description', 
      width: '30%',
      render: (description) => (
        <span className="text-truncate">{description}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '10%',
      render: (_, product) => (
        <div className="action-buttons">
          {isAdmin && (
            <>
              <button
                className="btn-action btn-edit"
                onClick={(e) => handleEdit(e, product)}
              >
                Edit
              </button>
              <button
                className="btn-action btn-delete"
                onClick={(e) => handleDeleteClick(e, product)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="doctor-list">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-description">Manage your product catalog</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={handleAddProduct}>
            + Add Product
          </button>
        )}
      </div>

      {error && (
        <ErrorMessage message={error?.response?.data?.message || 'Failed to load products'} />
      )}

      <div className="page-content">
        <div className="search-section">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search products by name..."
            initialValue={searchQuery}
          />
        </div>

        <Table
          columns={columns}
          data={products}
          onRowClick={handleRowClick}
          emptyMessage={searchQuery ? 'No products found matching your search' : 'No products added yet'}
        />
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product"
        size="small"
      >
        <div className="delete-modal">
          <p>Are you sure you want to delete {productToDelete?.name}?</p>
          <p className="delete-warning">This action cannot be undone.</p>
          
          {deleteMutation.isError && (
            <ErrorMessage 
              message={deleteMutation.error?.response?.data?.message || 'Failed to delete product'}
            />
          )}

          <div className="modal-actions">
            <button
              className="btn-secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </button>
            <button
              className="btn-danger"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;

