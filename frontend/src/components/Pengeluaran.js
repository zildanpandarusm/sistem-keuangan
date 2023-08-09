import React, { useMemo, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenSquare, faTrashAlt, faX } from '@fortawesome/free-solid-svg-icons';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './css/modal.css';
import './css/style.css';

const Pengeluaran = () => {
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [hapus, setHapus] = useState(false);
  const [tanggal, setTanggal] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [sumber, setSumber] = useState('');
  const [idData, setIdData] = useState('');
  const [pengeluaran, setPengeluaran] = useState([]);
  const hasil = useSelector((state) => state.auth);

  const calculateTotalPengeluaran = () => {
    let total = 0;

    pengeluaran.forEach((item) => {
      total += parseInt(item.jumlah);
    });

    return total;
  };

  const getPengeluaran = async () => {
    const response = await axios.get('http://localhost:5000/pengeluaran');
    setPengeluaran(response.data);
  };

  const getPengeluaranById = async (id) => {
    const response = await axios.get(`http://localhost:5000/pengeluaran/${id}`);
    setTanggal(response.data.tanggal);
    setJumlah(response.data.jumlah);
    setSumber(response.data.sumber);
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/pengeluaran/${idData}`);
    setIdData('');
    setShow(false);
    getPengeluaran();
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (!edit) {
      try {
        await axios.post('http://localhost:5000/pengeluaran', {
          tanggal: tanggal,
          jumlah: jumlah,
          sumber: sumber,
        });
        getPengeluaran();
        setShow(false);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        await axios.patch(`http://localhost:5000/pengeluaran/${idData}`, {
          tanggal: tanggal,
          jumlah: jumlah,
          sumber: sumber,
        });
        getPengeluaran();
        setShow(false);
        handleVariabel();
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const editModal = (id) => {
    setHapus(false);
    setShow(!show);
    setEdit(!edit);
    setIdData(id);
    getPengeluaranById(id);
  };

  const handleVariabel = () => {
    setIdData('');
    setTanggal('');
    setJumlah('');
    setSumber('');
    setEdit(false);
  };

  const deleteIcon = (id) => {
    setHapus(!hapus);
    setShow(!show);
    setIdData(id);
  };

  useEffect(() => {
    getPengeluaran();
  }, []);

  const batalHapusModal = () => {
    setHapus(!hapus);
    setShow(!show);
  };

  const toggleModal = () => {
    setHapus(false);
    setShow(!show);
    handleVariabel();
  };

  useEffect(() => {
    setStyle();
    if (show) {
      const handleSilang = () => {
        if (hapus === false) {
          const tandaX = document.querySelector('.box .tandaX');
          const box = document.querySelector('.modal.show .box');
          box.style.borderTopWidth = '3px';
          box.style.borderBottomWidth = '10px';
          box.style.minHeight = '20rem';
          box.style.top = '0';
          tandaX.addEventListener('mouseover', () => {
            box.style.borderColor = '#c3c3c3';
          });
          tandaX.addEventListener('mouseleave', () => {
            box.style.borderColor = '#53cdb1';
          });
        } else {
          const box = document.querySelector('.modal.show .box');
          box.style.borderWidth = '10px';
          box.style.minHeight = '30%';
          box.style.top = '-30%';
        }
      };
      handleSilang();
    }
  }, [show]);

  const setStyle = () => {
    const aside = document.querySelector('aside');
    const navbar = document.querySelector('.navbar');
    const modal = document.querySelector('.modal');
    if (show) {
      aside.style.zIndex = '-90';
      navbar.style.zIndex = '-100';
      modal.classList.add('show');
    } else {
      aside.style.zIndex = '10';
      navbar.style.zIndex = '5';
      modal.classList.remove('show');
    }
  };

  const data = useMemo(
    () =>
      pengeluaran.map((item) => ({
        nomor: item.uuid,
        tanggal: item.tanggal,
        jumlah: item.jumlah,
        sumber: item.sumber,
      })),
    [pengeluaran]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Nomor',
        accessor: 'nomor',
        Cell: ({ row }) => {
          return <div>{row.index + 1}</div>;
        },
      },
      {
        Header: 'Tanggal',
        accessor: 'tanggal',
      },
      {
        Header: 'Jumlah',
        accessor: 'jumlah',
      },
      {
        Header: 'Sumber',
        accessor: 'sumber',
      },
      {
        Header: 'Aksi',
        Cell: ({ row }) => (
          <div className="aksi">
            <button className="edit" onClick={() => editModal(row.original.nomor)}>
              <FontAwesomeIcon icon={faPenSquare} />
            </button>
            <button className="hapus" onClick={() => deleteIcon(row.original.nomor)}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="pengeluaran">
      <div className="tambahPengeluaran">
        <div className="totPengl">
          <h4>Total Pengeluaran:</h4>
          <p>Rp {calculateTotalPengeluaran()}</p>
        </div>
        {hasil.user && hasil.user.role === 'admin' && (
          <button onClick={toggleModal}>
            <FontAwesomeIcon className="icon" icon={faPlus} />
            <p>Tambah</p>
          </button>
        )}
      </div>
      <div className="tblKonten">
        <div className="table-controls">
          <label htmlFor="cari">Search : </label>
          <input type="text" value={globalFilter || ''} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Cari..." id="cari" />
        </div>
        <table className="tbl" {...getTableProps()} border="1">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span className="sorted">{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pgInfo">
          <span>
            Halaman{' '}
            <strong>
              {pageIndex + 1} dari {pageOptions.length}
            </strong>{' '}
          </span>
          <div className="pagination">
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="modal">
        <div className="overlay">
          <div className="box">
            {!hapus ? (
              <>
                <div className="tandaX" onClick={toggleModal}>
                  <FontAwesomeIcon icon={faX} />
                </div>
                {edit ? <h2>Edit Pengeluaran</h2> : <h2>Tambah Pengeluaran</h2>}
                <form onSubmit={handleForm}>
                  <div className="formInput">
                    <label htmlFor="tanggal">Tanggal</label>
                    <input type="date" id="tanggal" onChange={(e) => setTanggal(e.target.value)} value={tanggal} required />
                  </div>
                  <div className="formInput">
                    <label htmlFor="jumlah">Jumlah</label>
                    <input type="text" placeholder="contoh: 200000" id="jumlah" onChange={(e) => setJumlah(e.target.value)} value={jumlah} required />
                  </div>
                  <div className="formInput">
                    <label htmlFor="sumber">Sumber</label>
                    <input type="text" placeholder="Masukkan sumber" id="sumber" onChange={(e) => setSumber(e.target.value)} value={sumber} required />
                  </div>
                  <div className="formButton">
                    {edit ? <button type="submit">Simpan</button> : <button type="submit">Tambah</button>}
                    <button type="button" onClick={toggleModal}>
                      Batal
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="yakin">Apakah Anda yakin ingin menghapus?</h2>
                <div className="hapusButton">
                  <button type="button" onClick={handleDelete}>
                    Hapus
                  </button>
                  <button type="button" onClick={batalHapusModal}>
                    Batal
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengeluaran;
